import React, { useState } from 'react';
import { Input } from 'antd';

interface EditableTitleProps {
  value: string;
  onChange: (newValue: string) => void;
}

const EditableTitle: React.FC<EditableTitleProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTempValue(value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onChange(tempValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return isEditing ? (
    <Input
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={handleBlur}
      onKeyPress={handleKeyPress}
      autoFocus
    />
  ) : (
    <span onDoubleClick={handleDoubleClick} style={{ cursor: 'pointer' }}>
      {value}
    </span>
  );
};

export default EditableTitle;
