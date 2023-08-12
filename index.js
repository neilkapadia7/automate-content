const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Set up canvas dimensions
const canvasWidth = 800;
const canvasHeight = 600;

// Load a font
registerFont(path.join(`${__dirname}/fonts`, 'Roboto-Medium.ttf'), { family: 'Roboto' });

// Function to generate a random quote
function generateQuote() {
    const quotes = [
        "Believe you can and you're halfway there.",
        "The only way to do great work is to love what you do.",
        "Don't watch the clock; do what it does. Keep going.",
        // Add more quotes here
    ];

    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

// Function to create an image with a quote
async function createImageWithQuote() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Set background color
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Load an image (optional)
    const backgroundImage = await loadImage(path.join(`${__dirname}/static/images`, 'whiteImage.png'));
    ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);

    // Set text properties
    ctx.fillStyle = '#000000';
    ctx.font = '30px "Your Font Name"';
    ctx.textAlign = 'center';

    // Generate a random quote
    const quote = generateQuote();

    // Position the quote on the canvas
    const x = canvasWidth / 2;
    const y = canvasHeight / 2;

    // Wrap text
    const maxLineWidth = 600;
    const lineHeight = 40;
    const words = quote.split(' ');
    let line = '';
    const lines = [];

    for (const word of words) {
        const testLine = line + (line ? ' ' : '') + word;
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxLineWidth) {
            lines.push(line);
            line = word;
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    // Draw the wrapped lines of text
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y - (lines.length / 2 - i) * lineHeight);
    }

    // Save the image to a file
    const outputFilePath = path.join(__dirname, 'output.png');
    const stream = canvas.createPNGStream();
    stream.pipe(fs.createWriteStream(outputFilePath));
    console.log('Image with quote saved:', outputFilePath);
}

// Create an image with a quote
createImageWithQuote();
