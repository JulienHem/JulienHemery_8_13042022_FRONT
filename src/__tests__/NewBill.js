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
    describe('When a bill is created', () => {
        it("should send the bill correctly", () => {

            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            document.body.innerHTML = NewBillUI();

            const newBill = new NewBill({document})
            newBill.fileName = "salut.jpg"
            const handleSubmit = jest.fn(newBill.handleSubmit);
            const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
            formNewBill.addEventListener('submit', handleSubmit);
            fireEvent.submit(formNewBill)
            expect(handleSubmit).toHaveBeenCalled()
        })
    })


    // TEST D'INTEGRATION BILLS
    // describe("Given I am a user connected as Admin", () => {
    //     describe("When I navigate to Bills", () => {
    //         test("fetches bills from mock API GET", async () => {
    //             const getSpy = jest.spyOn(store, "create")
    //             const bills = await store.create()
    //             expect(getSpy).toHaveBeenCalledTimes(1)
    //             expect(bills.data.length).toBe(1)
    //         })
    //         test("fetches bills from an API and fails with 404 message error", async () => {
    //             store.create.mockImplementationOnce(() =>
    //                 Promise.reject(new Error("Erreur 404"))
    //             )
    //             const html = BillsUI({error: "Erreur 404"})
    //             document.body.innerHTML = html
    //             const message = await screen.getByText(/Erreur 404/)
    //             expect(message).toBeTruthy()
    //         })
    //         test("fetches messages from an API and fails with 500 message error", async () => {
    //             store.create.mockImplementationOnce(() =>
    //                 Promise.reject(new Error("Erreur 500"))
    //             )
    //             const html = BillsUI({error: "Erreur 500"})
    //             document.body.innerHTML = html
    //             const message = await screen.getByText(/Erreur 500/)
    //             expect(message).toBeTruthy()
    //         })
    //     })
    // })
})
