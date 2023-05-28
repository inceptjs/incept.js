//types
import type { ReactNode } from 'react';
//hooks
import React, { useContext } from 'react';
import useLanguage from '../hooks/useLanguage';
//components
import I18nContext from '../context';

const Translate: React.FC<{
  values?: ReactNode|ReactNode[]
  children: ReactNode
}> = (props) => {
  const { placeholder } = useContext(I18nContext);
  const { template } = useLanguage();
  const { children, values = [] } = props;
  //change children to phrases and variables
  const phrases: string[] = [];
  //make sure variables is an array
  const variables: ReactNode[] = Array.isArray(values) ? values : [ values ];
  //make sure chunks is an array
  const chunks = Array.isArray(children) ? children : [ children ];
  //loop through chunks
  chunks.forEach(chunk => {
    //if chunk is a string
    if (typeof chunk === 'string') {
      //just push to phrases
      phrases.push(chunk);
    //otherwise, it's a variable  
    } else {
      //push a placeholder
      phrases.push(placeholder);
      //add to variables
      variables.push(chunk);
    }
  });

  if (typeof phrases[0] === 'string') {
    phrases[0].trimStart();
  }

  if (typeof phrases[phrases.length - 1] === 'string') {
    phrases[phrases.length - 1].trimEnd();
  }

  //make a translate function
  const translate = template(phrases.join(''));
  return (<>{translate(...variables)}</>);
};

export default Translate;