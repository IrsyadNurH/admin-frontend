import {
    UsePaginationInstanceProps,
    UsePaginationState,
    UseGlobalFiltersInstanceProps,
    UseGlobalFiltersState,
  } from "react-table";
  
  declare module "react-table" {
    export interface TableInstance<D extends object = {}>
      extends UsePaginationInstanceProps<D>,
        UseGlobalFiltersInstanceProps<D> {}
  
    export interface TableState<D extends object = {}>
      extends UsePaginationState<D>,
        UseGlobalFiltersState<D> {}
  }
  