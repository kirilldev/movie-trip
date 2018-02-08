/*eslint-env jasmine*/
/*global angular:false, inject:false*/

describe('TypeaheadComponent.js', function () {
    const testDatasource = ['Zero', 'One', 'Two', 'Three', 'Four',
        'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Onee'];

    let scope;
    let element;

    function getDropdownValues(element) {
        const resultItemEl = element[0].querySelectorAll('.Typeahead__results-item');
        return Array.from(resultItemEl).map(e => e.innerText.trim());
    }

    beforeEach(angular.mock.module('movieTripApp'));

    beforeEach(inject(function ($rootScope, $compile) {
        const tpl = `<typeahead datasource="datasource" 
                                on-updated="onUpdated"
                                limit-list="limitList">
                     </typeahead>`;
        scope = $rootScope.$new(true);
        scope.datasource = [];
        scope.limitList = null;
        scope.onUpdated = _ => _;
        element = $compile(angular.element(tpl))(scope);
        scope.$apply();
    }));

    it('must not display a dropdown on init', () => {
        //given
        scope.datasource = testDatasource;

        //when
        //....

        //then
        const resultsEl = element[0].querySelectorAll('.Typeahead__results');
        expect(resultsEl.length).toEqual(0);
    });

    it('must show a dropdown on a focus', () => {
        //given
        scope.datasource = testDatasource;

        //when
        element.find('input').triggerHandler('focus');

        //Then
        const resultsEl = element[0].querySelectorAll('.Typeahead__results');
        expect(resultsEl.length).toEqual(1);
    });

    it('must show 5 dropdown values sorted in asc order by default', () => {
        //given
        scope.datasource = testDatasource;
        const expectedDropdownValues = ['Eight', 'Five', 'Four', 'Nine', 'One'];

        //when
        element.find('input').triggerHandler('focus');

        //Then
        expect(getDropdownValues(element)).toEqual(expectedDropdownValues);
    });

    it('must limit amount of results in a dropdown if parameter was passed', () => {
        //given
        scope.datasource = testDatasource;
        scope.limitList = 2;
        const expectedDropdownValues = ['Eight', 'Five'];

        //when
        element.find('input').triggerHandler('focus');

        //Then
        expect(getDropdownValues(element)).toEqual(expectedDropdownValues);
    });

    it('must filter results in in a dropdown according to the input', () => {
        //given
        scope.datasource = testDatasource;
        const expectedDropdownValues = ['One', 'Onee'];
        const input = element.find('input');

        //when
        input.triggerHandler('focus');
        input.val('One');
        input.triggerHandler('input');

        //Then
        expect(getDropdownValues(element)).toEqual(expectedDropdownValues);
    });

    it('must not preserve input value on blur if it is not present in a datasource', () => {
        //given
        scope.datasource = testDatasource;
        const expectedInputValue = '';
        const valueAbsentInDataset = 'ne';
        const input = element.find('input');

        //when
        input.triggerHandler('focus');
        input.val(valueAbsentInDataset);
        input.triggerHandler('input');
        input.triggerHandler('blur');

        //Then
        expect(input.val()).toEqual(expectedInputValue);
    });

    it('must preserve input value on blur if entered value is present in a datasource', () => {
        //given
        scope.datasource = testDatasource;
        const expectedInputValue = 'One';
        const input = element.find('input');

        //when
        input.triggerHandler('focus');
        input.val('One');
        input.triggerHandler('input');
        input.triggerHandler('blur');

        //Then
        expect(input.val()).toEqual(expectedInputValue);
    });

    it('must ignore case while searching in datasource array', () => {
        //given
        scope.datasource = testDatasource;
        const expectedDropdownValues = ['One', 'Onee'];
        const input = element.find('input');

        //when
        input.triggerHandler('focus');
        input.val('one');
        input.triggerHandler('input');

        //Then
        expect(getDropdownValues(element)).toEqual(expectedDropdownValues);
    });

    it('must fill input when user clicks on item in dropdown list', () => {
        //given
        scope.datasource = testDatasource;
        const expectedValue = 'Five';
        const input = element.find('input');

        //when
        input.triggerHandler('focus');
        const resultItemEl = element[0].querySelectorAll('.Typeahead__results-item');
        const byExpectedValue = el => el.innerText.trim() === expectedValue;
        const el = Array.from(resultItemEl).find(byExpectedValue);
        angular.element(el).triggerHandler('mousedown');

        //Then
        expect(input.val()).toEqual(expectedValue);
    });
});
