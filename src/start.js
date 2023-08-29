const containerStyle = {
  display: "flex",
  gap: "16px",
  alignItems: "center"
}

const startContainerStyle = {
  display: "flex",
  gap: "4px"
}

const textStyle = {
  lineHeight: "1",
  margin: "0"
}

export default function StarRating({ maxRating = 5 }) {
  return (
    <div style={containerStyle}>
      <div style={startContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <span>S{i + 1}</span>
        ))}
      </div>
      <p style={textStyle}>{maxRating}</p>
    </div>
  )
}