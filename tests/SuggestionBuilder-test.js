import expect from 'expect';
import { getSuggestions, evalAllProperties, suggestions } from '../src/components/suggestionBuilder';


describe('get suggestion', () => {
    it('should lists . suggestions', () => {
        // Given
        // When
        const suggestion = getSuggestions('$.', 2, { test: 0 });
        // Then
        expect(suggestion).toEqual([
            { value: 'test', description: 'property', scopes: ['object'] },
            {
                description: 'get all values',
                value: '*',
                scopes: ['[]', '.']
            }
        ]);
    });

    it('should lists .. suggestions', () => {
        // Given
        // When
        const suggestion = getSuggestions('$..', 2, { test: 0, test2: [{test3: 1}] });
        // Then
        expect(suggestion).toEqual([
            { value: 'test', description: 'property', scopes: ['object'] },
            { value: 'test2', description: 'property', scopes: ['object'] },
            { value: 'test3', description: 'property', scopes: ['object'] }
        ]);
    });

    it('should lists object suggestions', () => {
        // Given
        // When
        const suggestion = getSuggestions('$', 2, { test: 0 });
        // Then
        expect(suggestion).toEqual(suggestions.filter(sug => sug.scopes.includes('object')));
    });

    it('should lists array suggestions', () => {
        // Given
        // When
        const suggestion = getSuggestions('$', 2, [0, 1]);
        // Then
        expect(suggestion).toEqual(suggestions.filter(sug => sug.scopes.includes('array')));
    });

    it('should lists pick suggestions', () => {
        // Given
        // When
        const suggestion = getSuggestions('$.test[]', 7, { test: [0, 1] });
        // Then
        expect(suggestion).toEqual(suggestions.filter(sug => sug.scopes.includes('[]')));
    });

    it('should not lists pick suggestions', () => {
        // Given
        // When
        const suggestion = getSuggestions('$.test[]', 8, { test: [0, 1] });
        // Then
        expect(suggestion).toEqual([]);
    });

    it('should lists suggestions when json path ends with part of an attribute', () => {
        // Given
        // When
        const suggestion = getSuggestions('$.tes', 5, { test: [0, 1] });
        // then
        expect(suggestion).toEqual([
            {
                'description': 'property',
                'scopes': [
                    'object'
                ],
                'value': 'test'
            }, ...suggestions.filter(sug => sug.scopes.includes('object'))]);
    });

    it('should lists suggestions when json path ends with an exact attribute', () => {
        // Given
        // When
        const suggestion = getSuggestions('$.test', 5, { test: {exemple: 'test'} });
        // then
        expect(suggestion).toEqual(suggestions.filter(sug => sug.scopes.includes('object')));
    });

    it('should lists no suggestions when json path is invalid', () => {
        // Given
        // When
        const suggestion = getSuggestions('$.hello[@', 1, { test: [0, 1] });
        // then
        expect(suggestion).toEqual([]);
    });

    it ('should lists no properties when json path is invalid', () => {
        // Given
        const suggestions = [{value: 'all_properties', description: 'test'},{value: 'all_properties_recursively', description: 'test'}];
        // When
        const evaluatedProperties = evalAllProperties(suggestions, '$....', {test: 'a'});
        // Then
        expect(evaluatedProperties).toEqual([[],[]]);
    });
});