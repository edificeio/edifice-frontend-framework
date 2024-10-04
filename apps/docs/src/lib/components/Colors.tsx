export function Colors(props: {
  color: string;
  hexa: string;
  nameVar: string;
  cssVar: string;
}) {
  return (
    <div className="ctn-card">
      <div
        className="background-color"
        style={{ backgroundColor: props.hexa }}
      ></div>
      <div className="description-color">
        <p className="name-color">{props.color}</p>
        <p className="hexa-color">
          <strong>hexa</strong>: {props.hexa} <br /> <strong>scss</strong>:{" "}
          {props.nameVar} <br /> <strong>css</strong>: {props.cssVar}
        </p>
      </div>
    </div>
  );
}
