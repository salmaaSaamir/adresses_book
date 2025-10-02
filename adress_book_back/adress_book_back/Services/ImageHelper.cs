using System;
using System.IO;
using System.Threading.Tasks;
using ImageMagick;

public class ImageHelper
{
    private readonly string _imagesFolder;

    public ImageHelper(string webRootPath)
    {
        _imagesFolder = Path.Combine(webRootPath, "images");

        if (!Directory.Exists(_imagesFolder))
            Directory.CreateDirectory(_imagesFolder);
    }

    public async Task<string> SaveBase64ImageAsWebP(string base64Image)
    {
        if (string.IsNullOrEmpty(base64Image))
            throw new ArgumentException("Base64 string is empty");

        var data = base64Image.Contains(",") ? base64Image.Split(',')[1] : base64Image;

        var bytes = Convert.FromBase64String(data);

        var fileName = $"image_{DateTime.Now:yyyyMMdd_HHmmssfff}.webp";
        var filePath = Path.Combine(_imagesFolder, fileName);

        using (var image = new MagickImage(bytes))
        {
            image.Format = MagickFormat.WebP;
            image.Write(filePath);
        }

        await Task.CompletedTask;

        return fileName; 
    }
}
