$images = @{
    "mlbb" = "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lct.jpg"
    "genshin" = "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvo.jpg"
    "pubg" = "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mrp.jpg"
    "valorant" = "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvt.jpg"
    "freefire" = "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvq.jpg"
    "honkai" = "https://images.igdb.com/igdb/image/upload/t_cover_big/co69r9.jpg"
    "clash" = "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvw.jpg"
    "roblox" = "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvz.jpg"
}

$imagesDir = "public/images"
If (!(Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Force -Path $imagesDir
}

foreach ($key in $images.Keys) {
    $url = $images[$key]
    $outFile = "$imagesDir\$key.jpg"
    try {
        Invoke-WebRequest -Uri $url -OutFile $outFile -UseBasicParsing -ErrorAction Stop
        Write-Host "Downloaded $key to $outFile"
    } catch {
        Write-Host "Failed to download $key from $url - $($_.Exception.Message)"
    }
}
