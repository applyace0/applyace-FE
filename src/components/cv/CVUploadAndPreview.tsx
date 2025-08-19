import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { PDFDownloadLink, Page as PDFPage, Text, View, Document as PDFDocument, StyleSheet } from '@react-pdf/renderer';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface CVUploadAndPreviewProps {
  inAppCVData?: any; // If present, render as PDF using @react-pdf/renderer
}

const styles = StyleSheet.create({
  page: { padding: 24 },
  section: { marginBottom: 12 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  text: { fontSize: 12, marginBottom: 4 },
});

const InAppCVPDF = ({ data }: { data: any }) => (
  <PDFDocument>
    <PDFPage size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>{data.full_name}</Text>
        <Text style={styles.text}>{data.email} | {data.phone} | {data.location}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Summary</Text>
        <Text style={styles.text}>{data.summary}</Text>
      </View>
      {/* Add more sections for experience, education, etc. */}
    </PDFPage>
  </PDFDocument>
);

const CVUploadAndPreview: React.FC<CVUploadAndPreviewProps> = ({ inAppCVData }) => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from('cvs').upload(`user-cvs/${f.name}`, f, { upsert: true });
    if (!error && data) {
      const { data: publicUrl } = supabase.storage.from('cvs').getPublicUrl(data.path);
      setPdfUrl(publicUrl.publicUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
      </div>
      {pdfUrl && (
        <div>
          <Document file={pdfUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
            {Array.from(new Array(numPages), (el, idx) => (
              <Page key={`page_${idx + 1}`} pageNumber={idx + 1} />
            ))}
          </Document>
        </div>
      )}
      {inAppCVData && (
        <div>
          <PDFDownloadLink document={<InAppCVPDF data={inAppCVData} />} fileName="cv.pdf">
            {({ loading }) => loading ? 'Preparing PDF...' : <Button>Download as PDF</Button>}
          </PDFDownloadLink>
          <div className="border p-2 mt-2">
            <strong>Preview (PDF style):</strong>
            <InAppCVPDF data={inAppCVData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CVUploadAndPreview; 