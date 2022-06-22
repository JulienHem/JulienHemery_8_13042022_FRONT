/**
 * @jest-environment jsdom
 */

import {fireEvent} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import mockedStore from "../__mocks__/store.js";
import userEvent from "@testing-library/user-event";


describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        const html = NewBillUI();
        window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee'
        }))
        document.body.innerHTML = html;
        const newBill = new NewBill({document, onNavigate: null, store: mockedStore, localStorage: null})
        const fileInput = document.querySelector(`input[data-testid="file"]`)
        const handleChangeFile = jest.fn(newBill.handleChangeFile);
        jest.spyOn(window, 'alert').mockImplementation(() => {
        });
        fileInput.addEventListener('change', handleChangeFile);

        test("Then I click on the file input and it should have the correct extension", () => {

            const fileTrue = new File(['testFile'], 'testFile.jpg', {type: 'image/jpg'})
            userEvent.upload(fileInput, fileTrue);
            expect(fileInput.files[0].name).toEqual('testFile.jpg')
        })

        test('When I choose a new file in an incorrect format, there should be an alert', () => {
            const fileFalse = new File(['testFile'], 'testFile.txt', {type: 'text/txt'})
            console.log(fileFalse)
            userEvent.upload(fileInput, fileFalse);
            expect(handleChangeFile).toHaveBeenCalled();
            expect(fileInput.files[0]).toStrictEqual(fileFalse);
            expect(fileInput.files).toHaveLength(1);
            expect(window.alert).toHaveBeenCalled();
        })
    })
    describe('When the input is getting a file', () => {
        it("should expect the file to be correct", () => {

            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            const onNavigate = () => {}

            const newBill = new NewBill({ document, onNavigate: onNavigate, store: null, localStorage: window.localStorage })

            document.body.innerHTML = NewBillUI();

            newBill.fileName = "salut.jpg"
            const handleChange = jest.fn(newBill.handleChangeFile);
            const inputBill = document.querySelector(`input[data-testid="file"]`)
            inputBill.addEventListener('change', handleChange);
            fireEvent.change(inputBill)
            expect(handleChange).toHaveBeenCalled()
        })
    })
    describe('When a bill is created', () => {
        it("should send the bill correctly", () => {

            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            const onNavigate = () => {}

            const newBill = new NewBill({ document, onNavigate: onNavigate, store: null, localStorage: window.localStorage })

            document.body.innerHTML = NewBillUI();

            newBill.fileName = "salut.jpg"
            const handleSubmit = jest.fn(newBill.handleSubmit);
            const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
            formNewBill.addEventListener('submit', handleSubmit);
            fireEvent.submit(formNewBill)
            expect(handleSubmit).toHaveBeenCalled()
        })
    })

})
