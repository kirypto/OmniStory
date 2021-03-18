interface CommonFilters {
    nameIs?: string;
    nameHas?: string;
    taggedAll?: string;
    taggedAny?: string;
    taggedOnly?: string;
    taggedNone?: string;
}

export interface LocationFilters extends CommonFilters {
    spanIncludes?: string;
    spanIntersects?: string;
}
