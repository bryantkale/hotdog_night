export const FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bungee&family=Work+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  .hdl-root { font-family: 'Work Sans', sans-serif; }
  .hdl-display { font-family: 'Bungee', sans-serif; }
  .hdl-mono { font-family: 'JetBrains Mono', monospace; }
  .hdl-bg {
    background-color: #EDE1C3;
    background-image: radial-gradient(circle at 1px 1px, rgba(34,30,24,0.06) 1px, transparent 0);
    background-size: 18px 18px;
  }
  .hdl-title { text-shadow: 2px 2px 0 #221E18; }
  .hdl-rating-emoji { filter: grayscale(1) opacity(0.35); transition: filter .12s; }
  .hdl-rating-emoji.on { filter: none; }
  .hdl-divider { position: relative; border-top: 2px dashed rgba(34,30,24,0.18); }
  .hdl-divider::before, .hdl-divider::after {
    content: ''; position: absolute; top: -9px; width: 18px; height: 18px; border-radius: 50%;
    background: #EDE1C3; border: 2px solid #221E18;
  }
  .hdl-divider::before { left: -10px; }
  .hdl-divider::after { right: -10px; }
  .hdl-photo-wrap {
    background-image: repeating-linear-gradient(45deg, #e7dcc2, #e7dcc2 10px, #ddd0b0 10px, #ddd0b0 20px);
  }
  .hdl-input:focus, .hdl-btn:focus, .hdl-emoji-btn:focus {
    outline: 3px solid #D9A62E; outline-offset: 1px;
  }
`;

export const labelStyle = {
    fontSize: 11.5,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#584f3f",
};

export const inputStyle = {
    fontSize: 14,
    padding: "9px 10px",
    border: "2px solid rgba(34,30,24,0.18)",
    borderRadius: 7,
    background: "#fff",
    color: "#221E18",
    fontFamily: "'Work Sans', sans-serif",
    width: "100%",
};
