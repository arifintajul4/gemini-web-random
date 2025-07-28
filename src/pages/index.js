import { useEffect, useState } from 'react';

export default function HomePage() {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const res = await fetch(`/api/render-html`);
        if (!res.ok) {
          setHtml('<p>Gagal memuat konten.</p>');
        } else {
          const text = await res.text();
          const cleanedHtml = text
            .replace(/```html/g, '')
            .replace(/```/g, '')
            .trim();
          setHtml(cleanedHtml);
        }
      } catch (err) {
        console.error('Error fetch HTML:', err);
        setHtml('<p>Terjadi kesalahan saat memuat konten.</p>');
      } finally {
        setLoading(false);
      }
    };

    fetchHtml();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Mohon tunggu...</p>
      </div>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f9f9f9',
    color: '#555',
    fontFamily: 'sans-serif',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '6px solid #e0e0e0',
    borderTop: '6px solid #6b21a8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loadingText: {
    fontSize: '18px',
  },
};

// Inject CSS keyframe untuk animasi spin (karena inline-style nggak bisa handle keyframe)
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
