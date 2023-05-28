//types
import type { ReactNode } from 'react';
//hooks
import { useContext } from 'react';
//components
import I18nContext from '../context';

export default function useLanguage() {
  const { 
    language, 
    placeholder,
    changeLanguage
  } = useContext(I18nContext);

  const engine = {
    //the current language
    language: language.name,
    //change language
    change: changeLanguage,
    //translate engine
    template(phrase: string) {
      const translation = language.translations[phrase] ?? phrase;
      const chunks = translation.split(placeholder);
      return function Translation(...variables: ReactNode[]) {
        //if no chunks, just return the translation
        if (translation.indexOf(placeholder) < 0) return translation;
        //build the children
        const children: ReactNode[] = [];
        chunks.forEach((chunk, i) => {
          //push the chunk
          children.push(chunk);
          //if theres a variable
          if (variables[i]) {
            //also push this
            children.push(variables[i]);
          }
        });
        const allStrings = children.filter(
          child => typeof child === 'string'
        ).length === children.length;
        if (allStrings) {
          return children.join('')
        }
        //return the rendered chunk
        return (<>{...children}</>);
      };
    },
    //translate inline
    inline(phrase: string, ...variables: ReactNode[]) {
      return engine.template(phrase)(...variables);
    },
    //quick string to string translation
    _(phrase: string, ...variables: (string|number)[]) {
      return engine.template(phrase)(...variables) as string;
    }
  };

  return engine;
};