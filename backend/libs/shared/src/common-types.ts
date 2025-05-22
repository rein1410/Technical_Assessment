import { ObjectLiteral } from "typeorm";

export interface StringOperators {
    eq?: string;
    notEq?: string;
    contains?: string;
    notContains?: string;
    in?: string[];
    notIn?: string[];
    regex?: string;
    isNull?: boolean;
}

export interface BooleanOperators {
    eq?: boolean;
    isNull?: boolean;
}

export interface NumberRange {
    start: number;
    end: number;
}

export interface NumberOperators {
    eq?: number;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    between?: NumberRange;
    isNull?: boolean;
}

export enum LogicalOperator {
    AND = "AND",
    OR = "OR"
}

export interface DateRange {
    start: Date;
    end: Date;
}

export interface DateOperators {
    eq?: Date;
    before?: Date;
    after?: Date;
    between?: DateRange;
    isNull?: boolean;
}

export interface ListQueryOptions<T extends ObjectLiteral> {
    take?: number | null;
    skip?: number | null;
    sort?: NullOptionals<SortParameter<T>> | null;
    filter?: NullOptionals<FilterParameter<T>> | null;
    filterOperator?: LogicalOperator;
}

export type NullOptionals<T> = {
    [K in keyof T]: undefined extends T[K] ? NullOptionals<T[K]> | null : NullOptionals<T[K]>;
};

export type PrimitiveFields<T extends ObjectLiteral> = {
    [K in keyof T]: NonNullable<T[K]> extends number | string | boolean | Date ? K : never
}[keyof T];

export type SortOrder = 'ASC' | 'DESC';

export type SortParameter<T extends ObjectLiteral> = {
    [K in PrimitiveFields<T>]?: SortOrder
};

export type FilterParameter<T extends ObjectLiteral> = {
    [K in PrimitiveFields<T>]?: T[K] extends string ? StringOperators
        : T[K] extends number ? NumberOperators
            : T[K] extends boolean ? BooleanOperators
                : T[K] extends Date ? DateOperators : StringOperators;
} & {
    _and?: Array<FilterParameter<T>>;
    _or?: Array<FilterParameter<T>>;
};
