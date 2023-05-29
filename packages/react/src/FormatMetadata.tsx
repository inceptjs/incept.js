//types
import type { FormatMetadataProps } from './types';
//react
import React from 'react';

const FormatMetadata: React.FC<FormatMetadataProps> = ({ value }) => {
  return (
    <table>
      <tbody>
        {Object.entries(value).map(([key, value]) => (
          <tr key={key}>
            <td style={{paddingRight: '10px'}}>{key}</td>
            <td style={{paddingLeft: '10px'}}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FormatMetadata;