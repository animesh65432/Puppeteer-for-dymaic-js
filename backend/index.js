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

        // Render the EJS template with user data
        const html = await ejs.renderFile(path.join(views, "download.ejs"), {
            name: userData.name,
            mail: userData.mail,
            location: userData.location,
            generatedAt: new Date().toLocaleDateString()
        });

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set the HTML content
        await page.setContent(html, {
            waitUntil: 'networkidle0'
        });

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
        return res.status(500).json({ error: "Failed to generate PDF" });
    }
});


// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });

module.exports = app
