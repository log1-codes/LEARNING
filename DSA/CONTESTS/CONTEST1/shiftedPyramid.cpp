#include <iostream>
using namespace std;

int main() {
    int n ;   
    cin>>n;
    for (int i = 1; i <= n; i++) {
        // print leading spaces
        for (int s = 1; s < i; s++) {
            cout << " ";
        }
        // print x's
        for (int x = 1; x <= i; x++) {
            cout << "x";
        }
        cout << endl;
    }
    return 0;
}
