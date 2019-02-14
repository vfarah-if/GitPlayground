import axios, { AxiosResponse } from "axios";
import {
    AccidentsQuery,
    AccidentStatistic,
    Paging,
    SortByOptions
} from "./../../../models";
import { ascending, compareBy, descending } from "./../../../sort";
import { accidents } from "./../../v2/controllers/accidentStatitics";

// tslint:disable-next-line:interface-name
interface DataByYear {
    year: number;
    data: AccidentStatistic[];
}

export class TransportForLondonClient {
    private cache = new Array<DataByYear>();
    public async getAccidentStatisticsByQuery(query: AccidentsQuery): Promise<Paging<AccidentStatistic>> {
        if (!query) {
            query = new AccidentsQuery();
        }
        // tslint:disable-next-line:no-console
        console.log("Filtering => ", query);
        return await this.getAccidentStatistics(
            new Date(query.from),
            new Date(query.to),
            query.severity,
            query.sortBy,
            Number(query.page),
            Number(query.pageSize)
        );
    }

    private async getAccidentStatistics(
        from: Date,
        to: Date,
        severity: string,
        sortBy: SortByOptions,
        page: number,
        pageSize: number): Promise<Paging<AccidentStatistic>> {

        const maxYear = Number(process.env.MAX_YEAR);

        if (from && from.getFullYear() < 2005) {
            this.raiseDataBelow2005();
        }

        if (from && from.getFullYear() > maxYear) {
            this.raiseMaxYearNotSupported(maxYear);
        }

        if (to && to.getFullYear() > maxYear) {
            this.raiseMaxYearNotSupported(maxYear);
        }

        if (from > to) {
            const temp = from;
            from = to;
            to = temp;
        }

        const allAccidentStatistics = Array<AccidentStatistic>();

        for (let year = from.getFullYear(); year <= to.getFullYear(); year++) {
            let dataByYear = this.cache.find((item) => item.year === year);
            if (!dataByYear) {
                // tslint:disable-next-line:no-console
                console.log("Retrieving year data from cache or TFL live site");
                const response = await this.getAccidentStatisticsByYear(year);
                const cacheItem = { year, data: response.data };
                this.cache.push(cacheItem);
                dataByYear = cacheItem;
            } else {
                // tslint:disable-next-line:no-console
                console.log(`Retrieved data from cache for year ${year}`);
            }
            if (dataByYear) {
                dataByYear.data.forEach((item) => {
                    allAccidentStatistics.push(item);
                });
            }
        }

        const fromAsISOString = from.toISOString();
        const toAsISOString = to.toISOString();
        // tslint:disable-next-line:no-console
        console.log(`Data length before filtering =>`, allAccidentStatistics.length);
        const filteredAccidentStatistics = allAccidentStatistics
            .filter((item) => item.severity && item.severity === severity &&
                item.date && item.date >= fromAsISOString && item.date <= toAsISOString);
        // tslint:disable-next-line:no-console
        console.log(`Data length after filtering =>`, filteredAccidentStatistics.length);
        // TODO: Sort the data by configured setting
        filteredAccidentStatistics.sort((a: AccidentStatistic, b: AccidentStatistic) =>
            compareBy(descending, (orderBy: AccidentStatistic) => orderBy.borough, a, b));

        const result = new Paging<AccidentStatistic>();
        result.data = filteredAccidentStatistics;
        return Promise.resolve<Paging<AccidentStatistic>>(result);
    }

    private raiseDataBelow2005() {
        throw new Error("No data below 2005");
    }

    private raiseMaxYearNotSupported(maxYear: number) {
        throw new Error(`No data greater than '${maxYear}'`);
    }

    private async getAccidentStatisticsByYear(year: number): Promise<AxiosResponse<AccidentStatistic[]>> {
        const headers = {
            headers: {
                "Content-Type": "application/json",
                // tslint:disable-next-line:object-literal-sort-keys
                "Accept": "application/json"
            }
        };
        const url = `${process.env.TFL_ACCIDENTS_URL}/${year}`;
        // tslint:disable-next-line:no-console
        console.log(`Retrieving data from '${process.env.TFL_ACCIDENTS_URL}/${year}'`);
        return axios.get(url, { headers });
    }
}
