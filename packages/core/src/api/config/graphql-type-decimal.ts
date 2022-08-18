import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import BigNumber from 'bignumber.js';

const GraphQLDecimal = new GraphQLScalarType({
  name: 'Decimal',
  description: 'Deciaml scalar type',
  serialize(value) {
    return new BigNumber(value).toPrecision(2);
  },
  parseValue(value) {
    if (new BigNumber(value).isNaN()) {
      throw new TypeError(
        `${String(value)} is not a valid decimal value.`
      )
    }
    return BigNumber(value)
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError(
        `${String(ast.kind)} is not a valid decimal kind.`
      )
    }
    return BigNumber(ast.value)
  },
});

export default GraphQLDecimal;
