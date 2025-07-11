const ejs = require("ejs");
const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const cors = require("cors")

const app = express();
app.use(express.json());

const views = path.resolve(__dirname, "./views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'styles')));
app.set("views", views);
app.use(cors({
    origin: "*"
}))

app.get("/", (req, res) => {
    res.render("User", { title: "Hello from EJS!", name: "Perplexity User" });
});
app.post("/user", async (req, res) => {
    try {
        let body = req.body

        console.log(body)
        return res.status(200).json(body)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "fucked up" })
    }
});
app.post("/generate-pdf", async (req, res) => {
    try {
        const userData = req.body;
        console.log("Generating PDF for:", userData);

        // Validate input data
        if (!userData.name || !userData.mail || !userData.location) {
            return res.status(400).json({ 
                error: "Missing required fields: name, mail, and location are required" 
            });
        }

        // Render the EJS template with user data
        const html = await ejs.renderFile(path.join(views, "download.ejs"), {
            name: userData.name,
            mail: userData.mail,
            location: userData.location,
            generatedAt: new Date().toLocaleDateString()
        });

        console.log("HTML template rendered successfully");

        // Launch Puppeteer with production-ready configuration
        console.log("Launching browser...");
        
        // Determine Chrome executable path based on environment
        let executablePath;
        const fs = require('fs');
        
        // Common Chrome executable paths for different environments
        const chromePaths = [
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        ];
        
        // Find available Chrome executable
        for (const path of chromePaths) {
            if (fs.existsSync(path)) {
                executablePath = path;
                console.log(`Using Chrome at: ${path}`);
                break;
            }
        }
        
        // Launch configuration
        const launchConfig = {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-default-browser-check',
                '--no-zygote',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection'
            ]
        };
        
        // Only set executablePath if we found one (for deployment compatibility)
        if (executablePath) {
            launchConfig.executablePath = executablePath;
        }
        
        const browser = await puppeteer.launch(launchConfig);

        console.log("Browser launched successfully");

        const page = await browser.newPage();

        // Set the HTML content
        await page.setContent(html, {
            waitUntil: 'networkidle0'
        });

        console.log("HTML content set successfully");

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        console.log("PDF generated successfully, size:", pdfBuffer.length, "bytes");

        await browser.close();

        // Set response headers for PDF download
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="user-details-${userData.name.replace(/\s+/g, '-')}.pdf"`,
            'Content-Length': pdfBuffer.length
        });

        // Send the PDF
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF generation error:', error);
        console.error('Error stack:', error.stack);
        
        // Return detailed error information for debugging
        return res.status(500).json({ 
            error: "Failed to generate PDF",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });

module.exports = app
