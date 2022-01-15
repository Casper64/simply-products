import React from 'react';

interface SwitchProps {
    isOn: boolean;
    handleToggle: React.ChangeEventHandler<HTMLInputElement>,
    onColor: string;
}

const Switch: React.FC<SwitchProps> = ({ isOn, handleToggle, onColor }) => {
  return (
    <div className="switch-container">
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label
        style={{ background: isOn ? onColor : '' }}
        className="react-switch-label"
        htmlFor={`react-switch-new`}
      >
        <span className={`react-switch-button`} />
      </label>
    </div>
  );
};

export default Switch;