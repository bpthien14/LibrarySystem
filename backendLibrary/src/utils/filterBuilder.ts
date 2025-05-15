export const buildMongoFilter = <T extends Record<string, any>>(
  queryParams: Record<string, any>,
  fieldMappings: Record<string, string | ((value: any) => any)>
): Record<string, any> => {
  const filters: Record<string, any> = {};

  Object.entries(fieldMappings).forEach(([paramName, fieldPath]) => {
    if (queryParams[paramName] !== undefined && queryParams[paramName] !== null) {
      if (typeof fieldPath === 'function') {
        const result = fieldPath(queryParams[paramName]);
        if (result !== null && result !== undefined) {
          Object.assign(filters, result);
        }
      } else {
        filters[fieldPath] = queryParams[paramName];
      }
    }
  });

  return filters;
};

export class MongoFilterBuilder {
  private filters: Record<string, any> = {};

  addCondition(field: string, value: any): MongoFilterBuilder {
    if (value !== undefined && value !== null) {
      this.filters[field] = value;
    }
    return this;
  }

  addRegexCondition(field: string, value: string | undefined): MongoFilterBuilder {
    if (value) {
      this.filters[field] = { $regex: value, $options: 'i' };
    }
    return this;
  }

  addDateRangeCondition(
    field: string, 
    startDate?: string | Date, 
    endDate?: string | Date
  ): MongoFilterBuilder {
    if (startDate || endDate) {
      this.filters[field] = this.filters[field] || {};
      
      if (startDate) {
        this.filters[field].$gte = startDate instanceof Date ? 
          startDate : new Date(startDate);
      }
      
      if (endDate) {
        this.filters[field].$lte = endDate instanceof Date ? 
          endDate : new Date(endDate);
      }
    }
    return this;
  }

  addInCondition(field: string, values?: any[]): MongoFilterBuilder {
    if (values && values.length > 0) {
      this.filters[field] = { $in: values };
    }
    return this;
  }

  addBooleanCondition(field: string, value?: string | boolean): MongoFilterBuilder {
    if (value !== undefined) {
      const boolValue = typeof value === 'string' ? 
        value.toLowerCase() === 'true' : Boolean(value);
      this.filters[field] = boolValue;
    }
    return this;
  }

  addConditions(conditions: Record<string, any>): MongoFilterBuilder {
    Object.entries(conditions).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        this.filters[key] = value;
      }
    });
    return this;
  }

  build(): Record<string, any> {
    return { ...this.filters };
  }
}