/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import {bills} from "../fixtures/bills.js"
import {dateConvertedBills} from "../fixtures/dateConvertedBills.js";
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockedStore from "../__mocks__/store.js";

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', {value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      const hasClass = windowIcon.classList.contains('active-icon');
      expect(hasClass).toBe(true)

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({data: bills})
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then the modal should be open after clicking on the eye icon", async () => {
      Object.defineProperty(window, 'localStorage', {value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      let show = '';
      $.fn.modal = jest.fn(modalValue => {
        show = modalValue
      })
      document.body.innerHTML = BillsUI({data: bills})
      await waitFor(() => screen.getAllByTestId('icon-eye'))
      const icon = screen.getAllByTestId('icon-eye');
      const bill = new Bills({document, onNavigate: null, store: null, localStorage: null})
      bill.handleClickIconEye(icon[0])
      expect(show).toEqual('show');

    })
    test('Then the method getbills should return bills', () => {

      //TODO CHANGER LES DATES
      const bill = new Bills({document, onNavigate: null, store: mockedStore, localStorage: null})
      bill.getBills()
          .then(data => {
            expect(data).toEqual(dateConvertedBills)
          })
    })
  })
  // TEST D'INTEGRATION BILLS
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI({data: bills})
      expect(await screen.getAllByText('refused')).toBeTruthy();

    })
  })

})
