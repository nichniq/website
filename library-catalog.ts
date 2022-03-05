type Place = { name: string } | { city: string } | { name: string; city: string };
type Person = { name: string };
type Organization = { name: string };

type Transaction
  = { type: "purchased"; at?: Place; timestamp?: Timestamp }
  | { type: "gifted"; by?: Array<Person | Organization>; timestamp?: Timestamp }
  | { type: "stolen"; from?: Person | Place; timestamp?: Timestamp }
  | { type: "returned"; by?: Person; timestamp?: Timestamp }
  | { type: "loaned"; to?: Person; timestamp?: Timestamp }
  | { type: "found"; at?: Place; timestamp?: Timestamp }
;

type d = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type YYYY = `19${d}${d}` | `20${d}${d}`;
type MM = `0${1|2|3|4|5|6|7|8|9}` | `1${0|1|2}`;
type DD = `${0}${1|2|3|4|5|6|7|8|9}` | `${1|2}${d}` | `3${0|1}`;
type Timestamp
  = `${YYYY}-${MM}-${DD}`
  | `${YYYY}-${MM}`
  | `${YYYY}`;

type Identifier
  = { type: "isbn10"; id: string } // International Standard Book Number, 10 digits
  | { type: "isbn13"; id: string } // International Standard Book Number, 13 digits
  | { type: "lccn"; id: string } // Library of Congress Control Number, 6 digits
;

interface Book {
  title: string;
  subtitle?: string;
  series?: string;
  external_reference?: URL;
  identifiers?: Identifier[];
  transactions?: Transaction[];
  notes?: string;
}

// export a factory that returns an alphabetized copy of the catalog
export default (): Book[] => [
  { title: "300 Art Nouveau Designs and Motifs in Full Color", /* ... */ },
  { title: "50 Things to Do with a Penknife", /* ... */ },
  { title: "A Bestiary of the Anthropocene", /* ... */ },
  { title: "A Book of Chores", /* ... */ },
].sort(
  function alphabetically({ title: a }, { title: b }) {
    return a.localeCompare(b);
  }
);
