export default function LoadingOverlay(props: any) {
  return (
    <div style={props.style} className={props.loading ? "loader" : ""}>
      {props.children}
    </div>
  );
}
