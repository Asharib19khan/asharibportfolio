import fitz
import glob

pdf_files = glob.glob('y:/portfolio/yeezus_react/public/certificates/*.pdf')
for pdf_path in pdf_files:
    try:
        doc = fitz.open(pdf_path)
        page = doc.load_page(0)
        pix = page.get_pixmap(dpi=300)
        png_path = pdf_path.replace('.pdf', '.png')
        pix.save(png_path)
        print(f"Converted {pdf_path} to {png_path}")
    except Exception as e:
        print(f"Failed {pdf_path}: {e}")
