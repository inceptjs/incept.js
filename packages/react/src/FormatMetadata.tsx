import React from 'react';

const FormatMetadata: React.FC<{ 
  value: Record<string, string|number> 
}> = ({ value }) => {
  return (
    <table>
      <tbody>
        {Object.entries(value).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FormatMetadata;