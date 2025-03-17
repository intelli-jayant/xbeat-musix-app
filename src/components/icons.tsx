export type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };
export const Play = ({ size = 24, height, width, ...props }: IconProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    fill="currentColor"
    height={size || height}
    width={size || width}
    {...props}
  >
    <path
      fill="currentColor"
      d="M19.266 13.516a1.917 1.917 0 0 0 0-3.032A35.762 35.762 0 0 0 9.35 5.068l-.653-.232c-1.248-.443-2.567.401-2.736 1.69a42.49 42.49 0 0 0 0 10.948c.17 1.289 1.488 2.133 2.736 1.69l.653-.232a35.762 35.762 0 0 0 9.916-5.416Z"
    />
  </svg>
);

export const Pause = ({ size = 24, height, width, ...props }: IconProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    fill="currentColor"
    height={size || height}
    width={size || width}
    {...props}
  >
    <path
      fill="currentColor"
      d="M17.276 5.47c.435.16.724.575.724 1.039V17.49c0 .464-.29.879-.724 1.039a3.69 3.69 0 0 1-2.552 0A1.107 1.107 0 0 1 14 17.491V6.51c0-.464.29-.879.724-1.04a3.69 3.69 0 0 1 2.552 0Zm-8 0c.435.16.724.575.724 1.039V17.49c0 .464-.29.879-.724 1.039a3.69 3.69 0 0 1-2.552 0A1.107 1.107 0 0 1 6 17.491V6.51c0-.464.29-.879.724-1.04a3.69 3.69 0 0 1 2.552 0Z"
    />
  </svg>
);
export * as Icons from "./icons";
