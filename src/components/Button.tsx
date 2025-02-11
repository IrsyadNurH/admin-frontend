interface ButtonProps {
    label: string;
    id?: string;
    disabled?: boolean;
  }
  
  function Button({ label, id, disabled }: ButtonProps) {
    return (
      <div className="container-button">
        <button id={id} disabled={disabled}>
          {label}
        </button>
      </div>
    );
  }
  
  export default Button;
  