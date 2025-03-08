import { createCanvas } from "canvas";

export const getCroppedImg = async (imageSrc, crop) => {
    const image = new Image();
    image.src = imageSrc;
    const canvas = createCanvas(crop.width, crop.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

    return canvas.toDataURL("image/jpeg");
};
