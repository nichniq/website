const uuid = () => "identifier"; // TODO: Use built-in Crypto object

export default function identifier(description) {
  return Object.freeze({
    description,
    symbol: new Symbol(description),
    uuid: uuid(),
  });
}
