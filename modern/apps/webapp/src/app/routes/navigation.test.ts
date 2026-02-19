import { describe, expect, it } from 'vitest';
import {
    getRouteDefinition,
    navigationGroups,
    navigationRouteDefinitions,
    routeAvailabilityMap,
    routeStatusMatrix,
} from './navigation';

describe('navigation metadata', () => {
    it('keeps route paths synchronized across nav groups, availability map, and status matrix', () => {
        const navPaths = navigationGroups.flatMap((group) => group.items.map((item) => item.to)).sort();
        const definitionPaths = navigationRouteDefinitions.map((entry) => entry.path).sort();
        const mapPaths = Object.keys(routeAvailabilityMap).sort();
        const matrixPaths = routeStatusMatrix.map((entry) => entry.route).sort();

        expect(navPaths).toEqual(definitionPaths);
        expect(mapPaths).toEqual(definitionPaths);
        expect(matrixPaths).toEqual(definitionPaths);
    });

    it('keeps route labels, availability states, and demo notes aligned with source definitions', () => {
        for (const definition of navigationRouteDefinitions) {
            const availability = routeAvailabilityMap[definition.path];
            const routeMatrixEntry = routeStatusMatrix.find((entry) => entry.route === definition.path);
            const byPathDefinition = getRouteDefinition(definition.path);

            expect(routeMatrixEntry).toBeDefined();
            expect(routeMatrixEntry?.label).toBe(definition.label);
            expect(routeMatrixEntry?.availability).toBe(definition.availability);
            expect(routeMatrixEntry?.destinationMode).toBe(definition.destinationMode);
            expect(routeMatrixEntry?.demoNote).toBe(definition.demoNote);
            expect(routeMatrixEntry?.demoNote.trim().length).toBeGreaterThan(0);
            expect(availability.mode).toBe(definition.availability);
            expect(availability.reason).toBe('reason' in definition ? definition.reason : undefined);
            expect(byPathDefinition.path).toBe(definition.path);
            expect(byPathDefinition.label).toBe(definition.label);
        }
    });
});
