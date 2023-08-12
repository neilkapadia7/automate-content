const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static').path;




// Function to generate a random motivational quote
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

// Function to save a quote to a text file
function saveQuoteToFile(quote) {
    const filePath = path.join(`${__dirname}/static`, 'quotes.txt');
    fs.appendFile(filePath, quote + '\n', (err) => {
        if (err) {
            console.error('Error saving quote:', err);
        } else {
            console.log('Quote saved:', quote);
        }
    });
}

// Generate a quote and save it to a file
const quote = generateQuote();
saveQuoteToFile(quote);


// Directory where the images are stored
const imagesDirectory = path.join(`${__dirname}/static/`, 'images');

// Function to generate a video from images
function generateVideo() {
    const outputVideoPath = path.join(`${__dirname}/static/`, 'output.mp4');
    
    // List all image files in the images directory
    const imageFiles = fs.readdirSync(imagesDirectory)
        .filter(file => file.endsWith('.jpg') || file.endsWith('.png'));

    if (imageFiles.length === 0) {
        console.error('No image files found in the directory.');
        return;
    }

    // Construct an array of arguments for ffmpeg
    const ffmpegArgs = [
        '-framerate', '1', // Set the framerate (1 image per second)
        '-i', path.join(imagesDirectory, '%d.jpg'), // Input pattern
        '-c:v', 'libx264', // Video codec
        '-r', '30', // Output framerate
        outputVideoPath // Output file path
    ];

    // Spawn the ffmpeg process
    const ffmpegProcess = spawn(ffmpegPath, ffmpegArgs);

    ffmpegProcess.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    ffmpegProcess.stderr.on('data', (data) => {
        console.error(data.toString());
    });

    ffmpegProcess.on('close', (code) => {
        if (code === 0) {
            console.log('Video creation completed successfully.');
        } else {
            console.error(`Video creation process exited with code ${code}.`);
        }
    });
}

// generateVideo();
