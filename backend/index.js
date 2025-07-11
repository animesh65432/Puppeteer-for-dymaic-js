const ejs = require("ejs");
const express = require("express");
const chromium = require("@sparticuz/chromium");
const puppeteerCore = require("puppeteer-core")
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
        const userData = req.body
        const html = await ejs.renderFile(path.join(views, "download.ejs"), {
            name: userData.name,
            mail: userData.mail,
            location: userData.location,
            generatedAt: new Date().toLocaleDateString()
        });


        const browser = await puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true
        });

        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: 'networkidle0' });

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

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="user-details-${userData.name.replace(/\s+/g, '-')}.pdf"`,
            'Content-Length': pdfBuffer.length
        });
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
