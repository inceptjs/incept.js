import Delete from './Query/Delete';
import Insert from './Query/Insert';
import Select from './Query/Select';
import Update from './Query/Update';

export default class Query {
  /**
   * Delete table query builder
   */
  public static delete(table: string, quote?: string) {
    return new Delete(table, quote);
  }

  /**
   * Inser table query builder
   */
  public static insert(table: string, quote?: string) {
    return new Insert(table, quote);
  }

  /**
   * Select table query builder
   */
  public static select(columns?: string|string[], quote?: string) {
    return new Select(columns, quote);
  }

  /**
   * Update table query builder
   */
  public static update(table: string, quote?: string) {
    return new Update(table, quote);
  }
}