import { describe, expect, it } from '@jest/globals';
import generate from '../src/cli/generate';
//import user from './assets/user.json';
//import post from './assets/post.json';

describe('Generator', () => {
  it('Should generate types', async() => {
    const actual = generate();
    console.log(actual)
    expect(actual).toContain(`t`);
  })
})