#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    for (int i = 1; i <= n; i++) {
        for (int s = 1; s < i; s++)
            cout << " ";

        if (i == 1) {
            cout << ">";
        } else {
            cout << ">";
            for (int s = 1; s <= 2*(i-1)-1; s++) 
                cout << " ";
            cout << ">";
        }
        cout << endl;
    }

    for (int i = n-1; i >= 1; i--) {
        for (int s = 1; s < i; s++) 
            cout << " ";

        if (i == 1) {
            cout << ">";
        } else {
            cout << ">";
            for (int s = 1; s <= 2*(i-1)-1; s++) 
                cout << " ";
            cout << ">";
        }
        cout << endl;
    }

    return 0;
}
