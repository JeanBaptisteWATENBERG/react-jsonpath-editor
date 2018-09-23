import expect from 'expect';
import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Previewer, { highlightingTags } from '../src/components/JsonPathPreviewer';

Enzyme.configure({ adapter: new Adapter() });

const defaultJson = {
    'store': {
        'book': [
            {
                'category': 'reference',
                'author': 'Nigel Rees',
                'title': 'Sayings of the Century',
                'price': 8.95
            },
            {
                'category': 'fiction',
                'author': 'Evelyn Waugh',
                'title': 'Sword of Honour',
                'price': 12.99
            },
            {
                'category': 'fiction',
                'author': 'Herman Melville',
                'title': 'Moby Dick',
                'isbn': '0-553-21311-3',
                'price': 8.99
            },
            {
                'category': 'fiction',
                'author': 'J. R. R. Tolkien',
                'title': 'The Lord of the Rings',
                'isbn': '0-395-19395-8',
                'price': 22.99
            }
        ],
        'bicycle': {
            'color': 'red',
            'price': 19.95
        }
    }
};

describe('Json path preview component', () => {
    it('should tag all authors', () => {
        const wraper = mount(<Previewer json={defaultJson} jsonPath='$..author' />);
        const paths = wraper.instance().evalJsonPath(defaultJson, '$..author');
        const taggedJSON = wraper.instance().tagPartOfJsonToHighlight(defaultJson, paths);
        
        defaultJson.store.book.forEach(book => {
            expect(taggedJSON).toContain(highlightingTags.start + book.author + highlightingTags.end);
        });
    });

    it('should tag all prices', () => {
        const wraper = mount(<Previewer json={defaultJson} jsonPath='$..price' />);
        const paths = wraper.instance().evalJsonPath(defaultJson, '$..price');
        const taggedJSON = wraper.instance().tagPartOfJsonToHighlight(defaultJson, paths);
        
        defaultJson.store.book.forEach(book => {
            expect(taggedJSON).toContain(highlightingTags.start + book.price + highlightingTags.end);
        });
        expect(taggedJSON).toContain(highlightingTags.start + defaultJson.store.bicycle.price + highlightingTags.end);
    });

    it ('should tag first book\'s category', () => {
        const wraper = mount(<Previewer json={defaultJson} jsonPath='$..book[0].category' />);
        const paths = wraper.instance().evalJsonPath(defaultJson, '$..book[0].category');
        const taggedJSON = wraper.instance().tagPartOfJsonToHighlight(defaultJson, paths);
        
        expect(taggedJSON).toContain(highlightingTags.start + defaultJson.store.book[0].category + highlightingTags.end);
    });

    it ('should tag all books', () => {
        const wraper = mount(<Previewer json={defaultJson} jsonPath='$..book' />);
        const paths = wraper.instance().evalJsonPath(defaultJson, '$..book');
        const taggedJSON = wraper.instance().tagPartOfJsonToHighlight(defaultJson, paths);
        
        expect(taggedJSON).toContain('£CR££INC£££TAGGED£[£CR££INC£{£CR££INC£"category": "reference",£CR£"author": "Nigel Rees",£CR£"title": "Sayings of the Century",£CR£"price": 8.95£DEC££CR£},£CR£{£CR££INC£"category": "fiction",£CR£"author": "Evelyn Waugh",£CR£"title": "Sword of Honour",£CR£"price": 12.99£DEC££CR£},£CR£{£CR££INC£"category": "fiction",£CR£"author": "Herman Melville",£CR£"title": "Moby Dick",£CR£"isbn": "0-553-21311-3",£CR£"price": 8.99£DEC££CR£},£CR£{£CR££INC£"category": "fiction",£CR£"author": "J. R. R. Tolkien",£CR£"title": "The Lord of the Rings",£CR£"isbn": "0-395-19395-8",£CR£"price": 22.99£DEC££CR£}£DEC££CR£]£TAGGED£££DEC£');
    });

    it('should display length preview', () => {
        const wraper = mount(<Previewer json={defaultJson} jsonPath='$..book.length' />);
        const paths = wraper.instance().evalJsonPath(defaultJson, '$..book.length');
        const taggedJSON = wraper.instance().tagPartOfJsonToHighlight(defaultJson, paths);

        expect(taggedJSON).toContain('.length = 4');
    });

    it ('should not tag anything', () => {
        const wraper = mount(<Previewer json={defaultJson} jsonPath='$..books' />);
        const paths = wraper.instance().evalJsonPath(defaultJson, '$..books');
        const taggedJSON = wraper.instance().tagPartOfJsonToHighlight(defaultJson, paths);

        expect(taggedJSON).toNotContain(highlightingTags.start);
        expect(taggedJSON).toNotContain(highlightingTags.end);
    });
});