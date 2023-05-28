//types
import type { FormatTableProps } from '@inceptjs/react/dist/types';
//react
import React from 'react';

const FormatTable: React.FC<FormatTableProps> = ({ value }) => {
  return (
    <table>
      <thead>
        <tr>
          {Object.keys(value[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {value.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, index) => (
              <td key={index}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FormatTable;