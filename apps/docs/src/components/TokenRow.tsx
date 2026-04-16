export function TokenTable({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
      <thead>
        <tr style={{ textAlign: "left", borderBottom: "2px solid #e4e4e4" }}>
          <th style={{ padding: "8px 12px", width: "30%" }}>Sass variable</th>
          <th style={{ padding: "8px 12px", width: "40%" }}>CSS custom property</th>
          <th style={{ padding: "8px 12px" }}>Valeur</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function TokenRow({
  name,
  cssVar,
  value,
}: {
  name: string;
  cssVar: string;
  value: string;
}) {
  return (
    <tr style={{ borderBottom: "1px solid #f2f2f2" }}>
      <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{name}</td>
      <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "#5555F7" }}>{cssVar}</td>
      <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{value}</td>
    </tr>
  );
}
