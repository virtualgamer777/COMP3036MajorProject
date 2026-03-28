export function cx(
  ...classes: Array<
    string | Record<string, boolean | null | undefined> | null | undefined
  >
): string {
  // class helper that turns a list of classes into a single string
  // if one of the classes is an object, it will add the key if the value is truthy

  // e.g. cx("foo", "bar") => "foo bar"
  // e.g. cx("foo", { bar: true }) => "foo bar"
  return classes
    .flatMap((entry) => { //iterate over objects
      if (!entry) return []; // return if empty
      //if its a string, return strings
      if (typeof entry === "string") return entry ? [entry] : [];

      //if its a class, check if each key is truthy, if so, add it.
      return Object.entries(entry)
        .filter(([, enabled]) => Boolean(enabled))
        .map(([className]) => className);
    }) 
    .join(" "); // combine the array into a string with spaces seperating them
}

export default cx;
