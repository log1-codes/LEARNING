#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    if (n % 400 == 0) {
        cout << "Yes";
    }
    else if (n % 100 == 0) {
        cout << "No";
    }
    else if (n % 4 == 0) {
        cout << "Yes";
    }
    else {
        cout << "No";
    }

    return 0;
}
