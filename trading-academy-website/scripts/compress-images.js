#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const SUPPORTED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.bmp',
  '.tif',
  '.tiff',
]);

function parseArgs(argv) {
  const args = {
    inputDir: '',
    outputDir: '',
    targetKb: 220,
    qualityStart: 82,
    minQuality: 38,
    maxWidth: 1800,
    maxHeight: 1800,
    inPlace: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--target-kb') args.targetKb = Number(argv[++i] || 220);
    else if (arg === '--quality') args.qualityStart = Number(argv[++i] || 82);
    else if (arg === '--min-quality') args.minQuality = Number(argv[++i] || 38);
    else if (arg === '--max-width') args.maxWidth = Number(argv[++i] || 1800);
    else if (arg === '--max-height') args.maxHeight = Number(argv[++i] || 1800);
    else if (arg === '--in-place') args.inPlace = true;
    else if (!args.inputDir) args.inputDir = arg;
    else if (!args.outputDir) args.outputDir = arg;
  }

  return args;
}

async function listImages(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      const nested = await listImages(fullPath);
      results.push(...nested);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }

  return results.sort();
}

async function compressOneImage(sourcePath, outputPath, options) {
  const targetBytes = options.targetKb * 1024;
  let quality = options.qualityStart;

  while (quality >= options.minQuality) {
    const buffer = await sharp(sourcePath)
      .rotate()
      .resize({
        width: options.maxWidth,
        height: options.maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({
        quality,
        mozjpeg: true,
        progressive: true,
        chromaSubsampling: '4:2:0',
      })
      .toBuffer();

    if (buffer.length <= targetBytes) {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, buffer);
      return { quality, sizeKb: buffer.length / 1024 };
    }

    quality -= 8;
  }

  const fallbackBuffer = await sharp(sourcePath)
    .rotate()
    .resize({
      width: options.maxWidth,
      height: options.maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({
      quality: options.minQuality,
      mozjpeg: true,
      progressive: true,
      chromaSubsampling: '4:2:0',
    })
    .toBuffer();

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, fallbackBuffer);

  return {
    quality: options.minQuality,
    sizeKb: fallbackBuffer.length / 1024,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.inputDir) {
    console.error('Usage: node scripts/compress-images.js <input-dir> [output-dir] [--target-kb 220] [--quality 82] [--in-place]');
    process.exit(1);
  }

  const inputDir = path.resolve(args.inputDir);
  const outputDir = args.outputDir ? path.resolve(args.outputDir) : path.resolve(args.inputDir + '-compressed');

  try {
    await fs.access(inputDir);
  } catch {
    console.error(`Input folder not found: ${inputDir}`);
    process.exit(1);
  }

  const files = await listImages(inputDir);

  if (files.length === 0) {
    console.log(`No supported images found in ${inputDir}`);
    return;
  }

  let totalOriginalKb = 0;
  let totalCompressedKb = 0;

  for (let i = 0; i < files.length; i += 1) {
    const sourcePath = files[i];
    const relativePath = path.relative(inputDir, sourcePath);
    const destinationPath = args.inPlace
      ? sourcePath
      : path.join(outputDir, relativePath);

    const originalSize = (await fs.stat(sourcePath)).size;
    totalOriginalKb += originalSize / 1024;

    console.log(`[${i + 1}/${files.length}] ${relativePath}`);

    const finalResult = await compressOneImage(sourcePath, destinationPath, {
      targetKb: args.targetKb,
      qualityStart: args.qualityStart,
      minQuality: args.minQuality,
      maxWidth: args.maxWidth,
      maxHeight: args.maxHeight,
    });

    const writtenSize = (await fs.stat(destinationPath)).size / 1024;
    totalCompressedKb += writtenSize;

    console.log(`  compressed to ${finalResult.sizeKb.toFixed(1)} KB using quality ${finalResult.quality}`);
  }

  console.log('\nSummary:');
  console.log(`Original total: ${totalOriginalKb.toFixed(1)} KB`);
  console.log(`Compressed total: ${totalCompressedKb.toFixed(1)} KB`);
  console.log(`Saved: ${(totalOriginalKb - totalCompressedKb).toFixed(1)} KB`);
}

main().catch((error) => {
  console.error('Compression failed:', error);
  process.exit(1);
});
