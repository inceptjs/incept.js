import FormatColor from '@inceptjs/react/src/FormatColor';
import FormatCountry from '@inceptjs/react/src/FormatCountry';
import FormatCurrency from '@inceptjs/react/src/FormatCurrency';
import FormatDate from '@inceptjs/react/src/FormatDate';
import FormatEmail from '@inceptjs/react/src/FormatEmail';
import FormatFormula from '@inceptjs/react/src/FormatFormula';
import FormatHTML from '@inceptjs/react/src/FormatHTML';
import FormatImage from '@inceptjs/react/src/FormatImage';
import FormatImagelist from '@inceptjs/react/src/FormatImagelist';
import FormatJSON from '@inceptjs/react/src/FormatJSON';
import FormatLink from '@inceptjs/react/src/FormatLink';
import FormatList from '@inceptjs/react/src/FormatList';
import FormatMarkdown from '@inceptjs/react/src/FormatMarkdown';
import FormatMetadata from '@inceptjs/react/src/FormatMetadata';
import FormatNumber from '@inceptjs/react/src/FormatNumber';
import FormatOverflow from '@inceptjs/react/src/FormatOverflow';
import FormatRating from '@inceptjs/react/src/FormatRating';
import FormatSeparated from '@inceptjs/react/src/FormatSeparated';
import FormatTable from '@inceptjs/react/src/FormatTable';
import FormatTaglist from '@inceptjs/react/src/FormatTaglist';
import FormatText from '@inceptjs/react/src/FormatText'; 
import FormatYesno from '@inceptjs/react/src/FormatYesno';

const Page = () => {
  return (
    <div className="p-4">
      <div>
        <div className="mt-4">
          <FormatColor value="#D90000" lg />
        </div>
        <div className="mt-4">
          <FormatColor value="#D90000" text={false} />
        </div>
        <div className="mt-4">
          <FormatColor value="#D90000" box={false} />
        </div>
      </div>
      <div>
        <div className="mt-4">
          <FormatCountry value="PH" lg />
        </div>
        <div className="mt-4">
          <FormatCountry value="US" text={false} />
        </div>
        <div className="mt-4">
          <FormatCountry value="GB" flag={false} />
        </div>
      </div>
      <div>
        <div className="mt-4">
          <FormatCurrency value="PHP" lg />
        </div>
        <div className="mt-4">
          <FormatCurrency value="USD" text={false} />
        </div>
        <div className="mt-4">
          <FormatCurrency value="USD" flag={false} />
        </div>
      </div>
      <div>
        <div className="mt-4">
          <FormatDate value="Mon, 29 May 2023 05:03:22 GMT" />
        </div>
        <div className="mt-4">
          <FormatDate value="Mon, 29 May 2023 05:03:22 GMT" format="YYYY-MM-DD HH:MM:SS" />
        </div>
        <div className="mt-4">
          <FormatDate value="Mon, 29 May 2023 05:03:22 GMT" format="ago" />
        </div>
        <div className="mt-4">
          <FormatDate value="Mon, 29 May 2023 05:03:22 GMT" format="a" />
        </div>
      </div>
      <div>
        <div className="mt-4">
          <FormatEmail value="hi@mail.com" className="text-blue-600" />
        </div>
        <div className="mt-4">
          <FormatFormula value="29" formula="{x} + {this} + {y}" data={{ x: 4, y: 5 }} />
        </div>
        <div className="mt-4 w-">
          <FormatHTML value={`<h1 style="font-weight:bold">Hello</h1>`} />
        </div>
        <div className="mt-4">
          <FormatImage width="50" value="https://raw.githubusercontent.com/inceptjs/incept.js/main/docs/assets/incept-logo-square-2.png" />
        </div>
        <div className="mt-4">
          <FormatImagelist className="max-w-none h-28" value={[
            'https://raw.githubusercontent.com/inceptjs/incept.js/main/docs/assets/incept-logo-long.png',
            'https://raw.githubusercontent.com/inceptjs/incept.js/main/docs/assets/incept-logo-square-1.png',
            'https://raw.githubusercontent.com/inceptjs/incept.js/main/docs/assets/incept-logo-square-2.png',
            'https://raw.githubusercontent.com/inceptjs/incept.js/main/docs/assets/incept-logo-square-3.png'
          ]} />
        </div>
        <div className="mt-4">
          <FormatJSON className="text-xs" value={{ foo: 'bar', bar: 'foo'}} />
        </div>
        <div className="mt-4">
          <FormatLink value="https://www.incept.asia/" className="text-blue-600" />
        </div>
        <div className="mt-4">
          <FormatList value={[ 'one', 'two', 'three' ]} />
        </div>
        <div className="mt-4">
          <FormatList value={[ 'one', 'two', 'three' ]} ordered />
        </div>
        <div className="mt-4">
          <FormatMarkdown value="A paragraph with *emphasis* and **strong importance**" />
        </div>
        <div className="mt-4">
          <FormatMetadata value={{ foo: 'bar', 'very very long': 'foo'}} />
        </div>
      </div>
      <div>
        <div className="mt-4">
          <FormatNumber value="-1234567890.0987654321" />
        </div>
        <div className="mt-4">
          <FormatNumber value="-1234567890.0987654321" separator="," decimals={2} absolute={true} />
        </div>
      </div>
      <div>
        <div className="mt-4">
          <FormatOverflow value="a Long walk On the Beach" />
        </div>
        <div className="mt-4">
          <FormatOverflow value="a Long walk On the Beach" words />
        </div>
        <div className="mt-4">
          <FormatOverflow value="a Long walk On the Beach" length={4} />
        </div>
        <div className="mt-4">
          <FormatOverflow value="a Long walk On the Beach" length={4} words />
        </div>
        <div className="mt-4">
          <FormatOverflow value="a Long walk On the Beach" hellip />
        </div>
        <div className="mt-4">
          <FormatOverflow value="a Long walk On the Beach" words hellip />
        </div>
        <div className="mt-4">
          <FormatOverflow value="a Long walk On the Beach" length={4} hellip />
        </div>
        <div className="mt-4">
          <FormatOverflow value="a Long walk On the Beach" length={4} words hellip />
        </div>
      </div>
      <div>
        <div className="mt-4">
          <FormatRating value="6.0987654321" />
        </div>
        <div className="mt-4 text-orange-500 text-2xl">
          <FormatRating value="5" max={10} />
        </div>
        <div className="mt-4 text-blue-500 text-3xl">
          <FormatRating value="5" max={10} remainder={true} />
        </div>
      </div>
      <div>
        <div className="mt-4">
          <FormatSeparated value={[ 'one', 'two', 'three' ]} />
        </div>
        <div className="mt-4">
          <FormatSeparated value={[ 'one', 'two', 'three' ]} separator=", " />
        </div>
        <div className="mt-4">
          <FormatSeparated className="leading-7" value={[ 'one', 'two', 'three' ]} separator="line" />
        </div>
      </div>
      <div>
        <FormatTable 
          value={[{ Foo: 'bar', Bar: 'foo' }, { foo: 'bar', bar: 'foo' }]} 
          stripes={[['#999999', 'white'], ['white', 'black'], ['#EFEFEF', 'black']]}
        />
        <FormatTaglist pill value={['foo', 'long bar', 'baz']} />
        <FormatTaglist pill error value={['foo', 'long bar', 'baz']} />
      </div>
      <div>
        <div className="mt-4">
          <FormatText value="a Long walk On the Beach" />
        </div>
        <div className="mt-4">
          <FormatText value="a Long walk On the Beach" format="capitalize" />
        </div>
        <div className="mt-4">
          <FormatText value="a Long walk On the Beach" format="uppercase" />
        </div>
        <div className="mt-4">
          <FormatText value="a Long walk On the Beach" format="lowercase" />
        </div>
      </div>
      <div>
        <div className="mt-4">
          <FormatYesno value="1" />
        </div>
        <div className="mt-4">
          <FormatYesno value="" />
        </div>
        <div className="mt-4">
          <FormatYesno value="1" yes="oui" no="niet" />
        </div>
        <div className="mt-4">
          <FormatYesno value={0} yes="oui" no="niet" />
        </div>
      </div>
    </div>
  );
};

export default Page;
