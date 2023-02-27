export default function LoadingOverlay(props: any) {
  return <div className={props.loading ? "loader" : ""}>{props.children}</div>;
}