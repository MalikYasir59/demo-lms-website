Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$sourceImagePath = Join-Path $projectRoot "public\images\Logoitt.jpg"

if (-not (Test-Path $sourceImagePath)) {
    Write-Error "Source image not found at $sourceImagePath"
    exit 1
}

Write-Host "Loading source image from $sourceImagePath..."
$srcImage = [System.Drawing.Image]::FromFile($sourceImagePath)

# Function to resize and save as PNG
function Save-PngResized($img, $width, $height, $outPath) {
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($img, 0, 0, $width, $height)
    
    $outDir = Split-Path -Parent $outPath
    if (-not (Test-Path $outDir)) {
        New-Item -ItemType Directory -Path $outDir -Force | Out-Null
    }
    
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "  -> Generated $outPath (${width}x${height} PNG)"
}

# Function to generate .ico
function Save-IcoResized($img, $size, $outPath) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($img, 0, 0, $size, $size)
    
    $hIcon = $bmp.GetHicon()
    $icon = [System.Drawing.Icon]::FromHandle($hIcon)
    
    $fs = New-Object System.IO.FileStream($outPath, [System.IO.FileMode]::Create)
    $icon.Save($fs)
    $fs.Close()
    
    $icon.Dispose()
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "  -> Generated $outPath (${size}x${size} ICO)"
}

Write-Host "Generating icons..."

# 1. Favicon .ico files for /favicon.ico requests
Save-IcoResized $srcImage 48 (Join-Path $projectRoot "public\favicon.ico")
Save-IcoResized $srcImage 48 (Join-Path $projectRoot "app\favicon.ico")

# 2. Next.js App Router app/icon.png and public/icon.png (high resolution modern browser icon)
Save-PngResized $srcImage 192 192 (Join-Path $projectRoot "app\icon.png")
Save-PngResized $srcImage 192 192 (Join-Path $projectRoot "public\icon-192.png")
Save-PngResized $srcImage 512 512 (Join-Path $projectRoot "public\icon-512.png")

# 3. Apple Touch Icon for iOS Safari and mobile bookmarks
Save-PngResized $srcImage 180 180 (Join-Path $projectRoot "app\apple-icon.png")
Save-PngResized $srcImage 180 180 (Join-Path $projectRoot "public\apple-touch-icon.png")

$srcImage.Dispose()
Write-Host "All ITT favicon and logo icons successfully generated!"
