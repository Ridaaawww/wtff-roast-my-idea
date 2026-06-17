export default function SiteFooter() {
  return (
    <footer
      style={{
        maxWidth: '720px',
        margin: '64px auto 0',
        paddingBottom: '40px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--muted)',
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        No egos were protected in the process.
      </p>
    </footer>
  )
}
