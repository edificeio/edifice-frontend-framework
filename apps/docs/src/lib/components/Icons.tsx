import { Card } from "./Card";

export const Icons = ({ icons }: { [key: string]: any }) => {
  const odeIcons = { ...icons };

  return (
    <div className="grid">
      {Object.keys(odeIcons).map((item, index) => {
        const Icon: any = odeIcons[item];
        return (
          <Card
            key={index}
            className="g-col-6 g-col-md-2"
            style={{
              padding: "1.6rem",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              height: "12rem",
            }}
          >
            <Icon />
            <p style={{ marginBottom: 0 }}>
              <strong
                style={{
                  fontSize: "12px",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item}
              </strong>
            </p>
          </Card>
        );
      })}
    </div>
  );
};
