export function Card(props: {
  className?: string;
  style?: Record<string, string>;
  noShadow?: boolean;
  children: React.ReactNode;
}) {
  const { className, style, noShadow, children } = props;

  const mergedStyle: any = {
    ...style,
    backgroundColor: "#fff",
    borderRadius: "8px",
  };

  if (!noShadow) {
    mergedStyle.boxShadow = "0px 2px 6px rgba(0, 0, 0, 0.15)";
  }

  return (
    <div className={className} style={mergedStyle}>
      {children}
    </div>
  );
}
