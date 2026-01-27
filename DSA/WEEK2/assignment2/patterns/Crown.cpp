#include <iostream>
using namespace std;

int main() {
    int n ;
    cin>>n;
    for (int i = 1; i <= n; i++) {

        // Last row
        if (i == n) {
            for (int j = 1; j <= 2 * n; j++)
                cout << "*";
        }
        else {
            // Left stars
            for (int j = 1; j <= i; j++)
                cout << "*";

            // Spaces
            for (int j = 1; j <= 2 * (n - i); j++)
                cout << " ";

            // Right stars
            for (int j = 1; j <= i; j++)
                cout << "*";
        }

        cout << endl;
    }

    return 0;
}
